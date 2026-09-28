import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const midtransClient = require('midtrans-client');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { slug, amount, package_tier, user_id } = await request.json();
    
    // Default to 149000 if not provided
    const finalAmount = amount || 149000;

    if (!user_id) {
       return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get business demo ID
    const { data: businessData, error: businessError } = await supabaseAdmin
      .from('business_demos')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (businessError || !businessData) {
       throw new Error('Business not found');
    }

    // Ensure profile exists to satisfy foreign key constraints
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user_id }, { onConflict: 'id' });

    if (profileError) {
       console.error('Profile Upsert Error:', profileError);
       throw new Error('Failed to synchronize user profile.');
    }

    // Insert pending transaction
    const { data: trxData, error: trxError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id,
        business_demo_id: businessData.id,
        amount: finalAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (trxError) throw trxError;

    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    let parameter = {
      "transaction_details": {
        "order_id": trxData.id, // Use our DB transaction ID
        "gross_amount": finalAmount
      },
      "credit_card": {
        "secure": true
      },
      "customer_details": {
        "first_name": "Growfin",
        "last_name": "Client",
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Also save package_tier tentatively on the business demo (or update later)
    await supabaseAdmin
      .from('business_demos')
      .update({ package_tier, user_id })
      .eq('id', businessData.id);

    return NextResponse.json({ token: transaction.token });

  } catch (error: any) {
    console.error('Midtrans/DB Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
