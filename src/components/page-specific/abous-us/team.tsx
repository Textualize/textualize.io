import React from "react"
import type { TeamMember } from "../../../domain"

interface TeamProps {
    members: TeamMember[]
}
export const Team = (props: TeamProps): JSX.Element => {
    return (
        <div className="team">
            {props.members.map((member, i) => (
                <React.Fragment key={member.id}>
                    {i !== 0 ? <hr className="container items__divider" /> : null}
                    <Member member={member} />
                </React.Fragment>
            ))}
        </div>
    )
}

interface MemberProps {
    member: TeamMember
}
const Member = (props: MemberProps): JSX.Element => {
    const { member } = props

    return (
        <section className="team__member" itemScope itemType="http://schema.org/Person" id={`team-member-${member.id}`}>
            <div className="team__member__portrait">
                <div className="team__member__portrait__image-wrapper">
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    <img src={props.member.imageUrl} alt={props.member.name} itemProp="image" />
                </div>
            </div>
            <div className="team__member__data">
                <h4 className="team__member__data__main_info" itemProp="name">
                    {props.member.name}
                </h4>
                <div className="team__member__data__main_info" itemProp="jobTitle">
                    {props.member.role}
                </div>
                <a
                    className="team__member__data__main_info team__member__data__twitter_link"
                    href={`https://twitter.com/${member.twitterHandle}`}
                    itemProp="sameAs"
                    target="_blank"
                    rel="noreferrer"
                >
                    <svg>
                        <use xlinkHref="#icon-twitter" />
                    </svg>
                    <span>@{member.twitterHandle}</span>
                </a>
                <div dangerouslySetInnerHTML={{ __html: props.member.description }} itemProp="description" />
            </div>
        </section>
    )
}
