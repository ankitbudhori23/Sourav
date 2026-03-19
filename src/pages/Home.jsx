import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const [previewBg, setPreviewBg] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const makeHoverVariant = (url) => {
    if (!url) return null;
    const m = url.match(/^(.*?)(\.[^./?#]+)([?#].*)?$/);
    if (!m) return url;
    const base = m[1];
    const ext = m[2];
    const tail = m[3] || "";
    // don't add .1 if it already ends with .1
    if (/\.1$/.test(base)) return url;
    return `${base}.1${ext}${tail}`;
  };

  const getUrlFromComputedStyle = (el) => {
    const style = window.getComputedStyle(el);
    const bg = style.backgroundImage;
    if (!bg || bg === "none") return null;
    const match = bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
    return match ? match[1] : null;
  };

  const showTimer = useRef(null);
  const hideTimer = useRef(null);
  const loadedCache = useRef(new Set());

  useEffect(() => {
    // Preload any `data-preview` images so the overlay appears reliably.
    const nodes = document.querySelectorAll(".hero-frame-image[data-preview]");
    nodes.forEach((n) => {
      const url = n.dataset.preview;
      if (url && !loadedCache.current.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => loadedCache.current.add(url);
      }
    });

    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handlePreviewEnter = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    // cancel any pending hide
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    // cancel pending show
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }

    let previewUrl = el.dataset.preview || getUrlFromComputedStyle(el);
    if (!previewUrl) return;
    previewUrl = makeHoverVariant(previewUrl);

    setPreviewBg(previewUrl);

    // If overlay already visible, switch immediately
    if (showPreview) return;

    // If we've already preloaded the image, show immediately.
    if (loadedCache.current.has(previewUrl)) {
      setShowPreview(true);
      return;
    }

    // Start loading image and show when loaded, but use a fallback timer
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      loadedCache.current.add(previewUrl);
      setShowPreview(true);
    };

    // fallback: show after a short delay even if load hasn't fired
    showTimer.current = setTimeout(() => {
      setShowPreview(true);
      showTimer.current = null;
    }, 120);
  };

  const handlePreviewLeave = () => {
    // cancel any pending show
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    // hide overlay and clear background after transition
    setShowPreview(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setPreviewBg(null);
      hideTimer.current = null;
    }, 420);
  };

  // Video modal state & handlers for showcase cards without an external URL
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const videoRef = useRef(null);

  const openVideoModal = (videoUrl, title = "", desc = "") => {
    setModalVideo(
      `https://d2jjpiwbo3e767.cloudfront.net/Anime/Anohana${videoUrl}`,
    );
    setModalTitle(title);
    setModalDesc(desc);
    setModalOpen(true);
    // prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
    // attempt to play after render
    setTimeout(() => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          const p = videoRef.current.play();
          if (p && typeof p.then === "function") p.catch(() => {});
        } catch (err) {}
      }
    }, 60);
  };

  const closeVideoModal = () => {
    setModalOpen(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (err) {}
    }
    setModalVideo(null);
    setModalTitle("");
    setModalDesc("");
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && modalOpen) closeVideoModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const handleCardClick = (e) => {
    const anchor = e.currentTarget;
    const href = anchor.getAttribute("href") || "";
    // if the link points to a video file, open modal instead of navigating
    if (/\.mp4($|\?)/i.test(href)) {
      e.preventDefault();
      const titleEl = anchor.querySelector("h3");
      const descEl = anchor.querySelector("p");
      const title =
        (titleEl && titleEl.textContent) || anchor.dataset.title || "";
      const desc = (descEl && descEl.textContent) || anchor.dataset.desc || "";
      openVideoModal(href, title, desc);
    }
  };
  return (
    <div className="home-bg">
      <Navbar />
      <main className="hero-section">
        <div className="hero-orbit hero-orbit-left" aria-hidden="true">
          <div className="hero-frame hero-frame-left-top">
            <div
              className="hero-frame-image img-moon"
              data-preview="/images/2.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
          <div className="hero-frame hero-frame-left-main">
            <div
              className="hero-frame-image img-astro"
              data-preview="/images/1.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
          <div className="hero-frame hero-frame-left-bottom">
            <div
              className="hero-frame-image img-frontier"
              data-preview="/images/6.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
        </div>

        <div className="hero-center">
          <h1 className="hero-title exact-hero-title">
            <span>AI VISUAL</span>
            <span>STORYTELLING</span>
          </h1>
          <p className="hero-subtitle exact-hero-subtitle">
            Merging advanced artificial intelligence with cinematic narrative.
          </p>
          <div className="hero-energy hero-energy-one"></div>
          <div className="hero-energy hero-energy-two"></div>
        </div>

        <div className="hero-orbit hero-orbit-right" aria-hidden="true">
          <div className="hero-frame hero-frame-right-top">
            <div
              className="hero-frame-image img-city"
              data-preview="/images/4.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
          <div className="hero-frame hero-frame-right-main">
            <div
              className="hero-frame-image img-ocean"
              data-preview="/images/5.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
          <div className="hero-frame hero-frame-right-bottom">
            <div
              className="hero-frame-image img-character"
              data-preview="/images/3.1.png"
              tabIndex="0"
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
              onFocus={handlePreviewEnter}
              onBlur={handlePreviewLeave}
            ></div>
          </div>
        </div>
      </main>
      <section className="showcase-section">
        <h2 className="showcase-title">PROJECT SHOWCASE</h2>
        <h3>Cinematic Projects</h3>
        <div className="showcase-cards">
          <a
            className="showcase-card"
            href="/1.mp4"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/video1.png"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>AI Cinematic Capability Test – Kling 3 | February 2026</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                Created a short experimental video using Kling AI 3 to evaluate
                the potential of generative AI in producing cinematic,
                film-quality visuals. The scene was conceptually inspired by the
                emotional tone and visual storytelling style of The Pursuit of
                Happyness, and was developed as a controlled test to assess AI’s
                ability to replicate Hollywood-style cinematography. The
                experiment focused on testing character realism, cinematic
                lighting, framing, and emotional storytelling to understand
                whether modern AI video models can approach the visual depth and
                narrative coherence typically achieved in traditional
                filmmaking. Key Focus Areas • AI video generation and cinematic
                scene design • Film-style lighting, framing, and composition •
                Emotional storytelling through AI-generated visuals • Evaluating
                AI capabilities for Hollywood-level content creation
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="/2.mp4"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/video2.png"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>
                AI Cinematic Concept Video – Kling 3 | “How to Date a
                Billionaire” | March 2026
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                Produced a short concept video titled “How to Date a
                Billionaire” using Kling AI 3 to explore the potential of
                generative AI in creating cinematic, narrative-driven video
                content. The project was developed as an experimental piece to
                evaluate how effectively AI can generate character-driven
                scenes, visual consistency, and film-style storytelling. The
                experiment focused on testing cinematic composition, lighting
                aesthetics, and narrative flow, while maintaining a visually
                polished output comparable to modern digital film production.
                Key Focus Areas • AI video generation with Kling 3 •
                Character-centric cinematic storytelling • Film-style lighting
                and composition • Evaluating AI workflows for narrative
                filmmaking
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/bose-the-mystery-unsolved"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1755166463135-1755166463817.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Bose - The Mystery Unsolved </h3>
              <p>
                Born in Cuttack on January 23, 1897, Subhas Chandra Bose rose to
                legendary status as Netaji, the fiery revolutionary who dared to
                envision a free India by any means. His rallying cry - “Give me
                blood and I shall give you freedom” - still echoes as a battle
                hymn of courage and sacrifice. Though his fate remains an
                enduring enigma - disappearing in a 1945 plane crash - his
                legacy continues to inspire generations of patriots ...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/ww2?trailer=1"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1760012595866-1760012596452.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>World War II — Trailer</h3>
              <p>
                In the fading light of global peace, two empires stand on the
                brink of destiny. World War 2 is a grand, unflinching Zingroll
                Original that captures the intense rivalry between the United
                States and Imperial Japan, a struggle for power, pride, and
                survival that changed the course of history forever. From the
                calm shores of Pearl Harbor to the smoldering ruins of Hiroshima
                and Nagasaki, the series follows the lives of soldiers, leaders,
                and ordinary people caught in the chaos ...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/ww2?season=1&episode=1"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1760012595866-1760012596452.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>World War II - Episode 1</h3>
              <p>
                In the heart-pounding first episode of this World War II series,
                the world stands on the brink of chaos. It begins with the
                shocking surprise attack on Pearl Harbor, a deadly strike that
                forces the United States into a war it never expected. As the
                country reels from the devastation, President Franklin D.
                Roosevelt delivers a stirring declaration of war, igniting a
                national resolve that will change the world forever.But the
                fight back is anything but simple...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/operation-sindoor"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1756447874344-1756447875020.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Operation Sindoor</h3>
              <p>
                When terror struck Pahalgam, India’s armed forces struck back
                with unmatched resolve. Nine terror camps were wiped out in
                minutes. This is Operation Sindoor — a story of resilience that
                every Indian must know. On the morning of February 14, 2019, a
                group of heavily armed militants launched an attack on a
                paramilitary post in Pahalgam...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/f1"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1754892001542-1754892002206.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Liam</h3>
              <p>
                Liam – From watching roaring engines on screen to feeling the
                asphalt under his own wheels, Liam’s journey is a high-octane
                ride of grit, passion, and speed. Born in a small town with big
                dreams, Liam’s love for racing ignited when he first saw Formula
                1 on TV. As he grew, so did his obsession with the sport,
                leading him to build makeshift go-karts and race against friends
                on dusty tracks...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/iron-jaw"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1753796529476-1753796530077.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Iron Jaw</h3>
              <p>
                Jack, Boxing legend, Olympic gold medalist, the pride of the
                nation, But everything changed the night he was found guilty of
                murdering a man inside his own gym's parking. In an instant,
                Jack’s world crumbled. He was stripped of his fame, banned from
                the sport, and abandoned by the very people who once cheered his
                name...
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://zingroll.com/watch/remnant"
            target="_blank"
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="https://d2jjpiwbo3e767.cloudfront.net/thumbnails/1764415753087-1764415753765.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Remnant</h3>
              <p>
                Reyan returns to a forgotten town after his mother’s death. But
                instead of memories, he finds erased lives. A set of hidden
                tapes leads him to Azaan, a young woman who recorded confessions
                no one was meant to hear. As the truth resurfaces, the town
                turns hostile and the past fights back. Reyan must uncover what
                they tried to bury..before they bury him.
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="/3.mp4"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/video3.png"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>Mahabharata – Karna’s Entrance (AI Cinematic Scene)</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                This project explores the dramatic entrance of Karna, one of the
                most powerful and complex warriors from the epic Mahabharata.
                The scene captures the moment when Karna enters the royal arena
                and boldly challenges Arjuna, instantly shifting the atmosphere
                from admiration to tension and rivalry. The objective of this
                project was to experiment with AI-driven cinematic storytelling,
                recreating a mythological moment using generative visuals. Each
                frame was designed with a single-character cinematic
                composition, focusing on detailed armor, emotional expressions,
                dramatic lighting, and epic scale to achieve a realistic
                mythological aesthetic. This sequence was created in July 2025
                as an early exploration of AI filmmaking workflows. Visual
                assets were generated using Midjourney, Veo 3, and FLUX Kontext.
                The final video was assembled by merging the generated AI clips
                together without additional editing, serving as a
                proof-of-concept for AI-generated cinematic sequences. Although
                the concept showed strong potential, the project was eventually
                discontinued due to base model limitations and shifting
                priorities toward other productions. Despite its cancellation,
                this work remains an experimental prototype demonstrating how
                generative AI can visualize large-scale mythological
                storytelling, highlighting my approach to prompt engineering,
                scene design, and AI-assisted cinematic direction.
              </p>
            </div>
          </a>
        </div>
      </section>
      <section className="showcase-section2">
        <h3>Commercial Ads</h3>

        <div className="showcase-cards">
          <a
            className="showcase-card"
            href="https://www.instagram.com/reel/DQb065liPyf/?igsh=MWtld2dkeHkwdjE2OA%3D%3D"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/bistro.jpeg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>chatturai_official</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                10-Minute Food. 10-Minute Ad Strategy. We saw Bistro by Blinkit
                and recognized a revolutionary concept: fresh, zero-preservative
                meals delivered at unprecedented speed (just 10 minutes!). A
                brand this bold needs a strategy that moves just as fast
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://www.instagram.com/reel/DP-TIaRDP4T/?igsh=MTl6MXRtbjlheWtiOA%3D%3D"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/mil.jpeg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>millettreeofficial</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                ✨ They came to wish Happy Diwali… but stayed for the taste of
                love. ❤️ Because every bite made with care, becomes a
                celebration. Millettree – Ghar ka swaad, sehat ke saath. 🌿
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://www.instagram.com/reel/DRZUqGQEt-B/?igsh=eWljcGhoaGR4YXVq"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/mil.jpeg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>millettreeofficial</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                At The Millettree, it does! Our Instant Ragi Tomato Soup is
                packed with the power of Finger Millet (Ragi)-rich in calcium,
                fiber, and ancient goodness. We source our grains from
                sustainable, pesticide-free farms so you know exactly what
                you're fueling your body with. Guilt-free, ready in 2 minutes,
                and absolutely delicious. Click the link in bio to stock up!
              </p>
            </div>
          </a>
        </div>
      </section>
      <section className="showcase-section2">
        <h3>Social Media & Avatar Content Management</h3>

        <div className="showcase-cards">
          <a
            className="showcase-card"
            href="https://www.instagram.com/itszenyuang?igsh=MXVxYWRzaDBraTY2cA%3D%3D"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/media1.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>itszenyuang</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                I give quiet lessons for a calmer mind. Expert of Qi,
                mindfulness & inner peace.
              </p>
            </div>
          </a>
          <a
            className="showcase-card"
            href="https://www.instagram.com/georgelessons?igsh=N3BqYWNvOHFucjB4"
            target="_blank"
            onClick={handleCardClick}
          >
            <div className="showcase-img-wrap">
              <img
                className="showcase-img"
                src="/images/media2.jpg"
                alt="Project Aurora"
              />
            </div>
            <div className="showcase-info">
              <h3>georgelessons</h3>
              <p
                style={{
                  fontSize: "16px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 10,
                  overflow: "hidden",
                }}
              >
                Discipline needs a clear mind & faith in God.
              </p>
            </div>
          </a>
        </div>
      </section>
      <footer className="footer"></footer>

      <div
        className={"hero-fullscreen-overlay" + (showPreview ? " show" : "")}
        style={{
          backgroundImage: previewBg ? `url("${previewBg}")` : "none",
          backgroundSize: "contain",
          backgroundColor: "black",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden={!showPreview}
      />
      {/* Video modal for showcase items without external redirect */}
      <div
        className={"hero-video-modal" + (modalOpen ? " open" : "")}
        aria-hidden={!modalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVideoModal();
        }}
      >
        <div
          className="hero-video-modal-content"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <video ref={videoRef} src={modalVideo || ""} controls />
          <div className="modal-meta">
            <h3 style={{ marginBottom: 10 }}>{modalTitle}</h3>
            <p>{modalDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
