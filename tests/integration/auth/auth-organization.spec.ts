import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { db } from '@/db'
import { member, organization, session as sessionTable, user } from '@/db/schema/auth'

describe('Organization Tenancy Database Persistence and Session Resolution', () => {
  const testUserId = crypto.randomUUID()
  const testEmail = `org-test-${Date.now()}@growfin.test`
  let testOrgId: string

  beforeAll(async () => {
    await db.insert(user).values({
      id: testUserId,
      name: 'Org Test User',
      email: testEmail,
      emailVerified: true,
    })
  })

  afterAll(async () => {
    if (testOrgId) {
      await db.delete(organization).where(eq(organization.id, testOrgId))
    }
    await db.delete(user).where(eq(user.id, testUserId))
  })

  it('persists organization record and owner membership in PostgreSQL', async () => {
    const orgSlug = `persisted-org-${Date.now()}`
    const [createdOrg] = await db
      .insert(organization)
      .values({
        name: 'Kopi Toko Persisted',
        category: 'Food & Beverage',
        packageTier: 'instant',
        phone: '08123456789',
        slug: orgSlug,
        status: 'published',
      })
      .returning()

    testOrgId = createdOrg.id
    expect(createdOrg.id).toBeDefined()
    expect(createdOrg.slug).toBe(orgSlug)
    expect(createdOrg.status).toBe('published')
    expect(createdOrg.packageTier).toBe('instant')

    const [createdMember] = await db
      .insert(member)
      .values({
        organizationId: createdOrg.id,
        role: 'owner',
        userId: testUserId,
      })
      .returning()

    expect(createdMember.organizationId).toBe(createdOrg.id)
    expect(createdMember.userId).toBe(testUserId)
    expect(createdMember.role).toBe('owner')

    const [fetchedOrg] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, createdOrg.id))
      .limit(1)

    expect(fetchedOrg).toBeDefined()
    expect(fetchedOrg.name).toBe('Kopi Toko Persisted')
    expect(fetchedOrg.phone).toBe('08123456789')

    const members = await db.select().from(member).where(eq(member.organizationId, createdOrg.id))

    expect(members).toHaveLength(1)
    expect(members[0].userId).toBe(testUserId)
  })

  it('resolves active organization ID from session record in database', async () => {
    const sessionToken = `test-token-${Date.now()}`
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.insert(sessionTable).values({
      id: sessionId,
      activeOrganizationId: testOrgId,
      expiresAt,
      token: sessionToken,
      userId: testUserId,
    })

    const [persistedSession] = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.id, sessionId))
      .limit(1)

    expect(persistedSession).toBeDefined()
    expect(persistedSession.activeOrganizationId).toBe(testOrgId)
    expect(persistedSession.userId).toBe(testUserId)

    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
  })

  it('cascades deletion from organization to member records', async () => {
    const tempSlug = `cascade-org-${Date.now()}`
    const [tempOrg] = await db
      .insert(organization)
      .values({
        name: 'Cascade Store',
        slug: tempSlug,
        status: 'published',
      })
      .returning()

    await db.insert(member).values({
      organizationId: tempOrg.id,
      role: 'owner',
      userId: testUserId,
    })

    await db.delete(organization).where(eq(organization.id, tempOrg.id))

    const remainingMembers = await db
      .select()
      .from(member)
      .where(eq(member.organizationId, tempOrg.id))

    expect(remainingMembers).toHaveLength(0)
  })
})
