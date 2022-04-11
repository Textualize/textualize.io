export const MailList = () => (
    <section className="container">
        <div className="mail-list">
            <h2 className="mail-list__headline">Join our mailing list. 👋</h2>
            <p className="mail-list__desc">Be the first to see what we’re working on</p>
            <form action="" className="mail-list__form">
                <input type="email" name="email" className="input u-fx-grow" aria-label="Your email" />
                <button type="submit" className="button button--lilac u-fx-no-shrink">
                    Submit
                </button>
            </form>
            <p className="mail-list__hint">No spam. Only important updates about Textualize.</p>
        </div>
    </section>
)
