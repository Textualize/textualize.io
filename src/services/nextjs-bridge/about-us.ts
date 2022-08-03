import type { GetStaticProps } from "next/types"
import type { TeamMember } from "../../domain"
import { teamMembers } from "../backend/about-us"

export const getTeamMembersStaticProps: GetStaticProps<{ teamMembers: TeamMember[] }> = async (_content) => {
    const members = await teamMembers()
    return { props: { teamMembers: members } }
}
