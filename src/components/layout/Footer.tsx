import { profile } from '../../data/resume'
import SocialIcons from '../ui/SocialIcons'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy type-body">
          © {year} {profile.fullName}
        </p>
        <div className="footer__links">
          <a href={`mailto:${profile.email}`} className="type-body">Email</a>
          <SocialIcons linkedin={profile.linkedin} instagram={profile.instagram || undefined} />
        </div>
      </div>
    </footer>
  )
}
