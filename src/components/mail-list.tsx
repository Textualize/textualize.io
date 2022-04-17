import React from "react"
import type { ChangeEvent, MouseEvent } from "react"
import { AppConfig } from "../config"

export const MailList = (): JSX.Element => {
    const [email, setEmail] = React.useState<string>("")
    const [emailWasFocused, setEmailWasFocused] = React.useState<boolean>(false)
    const emailInputRef = React.useRef<HTMLInputElement>(null)

    const emailInputWidth = email ? `${email.length}.3ch` : "2ch"

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim())
        setEmailWasFocused(true)
    }
    const onClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!emailInputRef.current) {
            return
        }
        const clickedElement = e.target as HTMLElement
        if (!clickedElement) {
            return
        }

        setEmailWasFocused(true)

        const clickedElementClass = clickedElement.getAttribute("class")
        if (clickedElementClass === "mail-list__terminal__email-input") {
            return //the browser is already managing the focus on the input :-)
        }
        emailInputRef.current.focus()
    }

    const emailInputAdditionalClass: string = emailWasFocused ? "mail-list__terminal__email-input-with-content" : ""

    return (
        <section className="container">
            <div className="mail-list" onClick={onClick}>
                <form
                    action={AppConfig.subscribeUrl}
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    noValidate
                >
                    <p className="mail-list__terminal">
                        <span className="prompt">&gt;&gt;&gt;</span>&nbsp;
                        <span
                            className="hidden-on-mobile"
                            style={{ color: "#ab9df2", textShadow: "0px 0px 16px #ab9df2" }}
                        >
                            textualize.io
                        </span>
                        <span style={{ color: "#78dce8", textShadow: "0px 0px 16px #78dce8" }}>
                            <span className="hidden-on-mobile">.</span>email=
                        </span>
                        <span style={{ color: "#a9dc76", textShadow: "0px 0px 16px #a9dc76" }}>&quot;</span>
                        <input
                            type="email"
                            id="email"
                            name="EMAIL"
                            className={["mail-list__terminal__email-input", emailInputAdditionalClass].join(" ")}
                            value={email}
                            onChange={onEmailChange}
                            style={{ width: emailInputWidth }}
                            ref={emailInputRef}
                        />
                        <span style={{ color: "#a9dc76", textShadow: "0px 0px 16px #a9dc76" }}>&quot;</span>
                    </p>
                </form>
                <p className="hint">Join our mailing list for updates on Textualize.</p>
            </div>
        </section>
    )
}
