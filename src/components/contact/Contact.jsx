import './Contact.css'

export default function Contact() {
    return (
        <section id="contact" className="contact container">
            <h2>Contact Us</h2>
            <form>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea rows="4" placeholder="Message"></textarea>
                <button type="submit">Send</button>
            </form>
        </section>
    )
}
