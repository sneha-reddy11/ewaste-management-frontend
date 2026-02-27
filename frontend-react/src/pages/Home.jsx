export default function Home() {
  return (
    <section className="home">
      <div className="home-hero">

        <h1>
          Welcome to <span>My Platform</span>
        </h1>

        <p>
          A simple, smart and modern way to manage your requests,
          track progress and stay connected.
        </p>

        <div className="home-actions">
          <button className="btn primary">
            Get Started
          </button>

          <button className="btn outline">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}