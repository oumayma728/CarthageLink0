import "./Home.css";

export default function Home() {
  return (
    <div>
  <div className="navbar">
    <ul>
      <li>Home</li>
      <li>About</li>
      <li>Contact</li>
      <a href="/register">
        <button className="Register"> Register</button>
      </a>
    </ul>
  </div>
  <div className="carthageLink">Carthage Link</div>
</div>

  );
}
