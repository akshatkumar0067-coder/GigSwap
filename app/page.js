"use client";

import { useState } from "react";

const initialGigs = [
  {
    id: 1,
    title: "Instagram Reel Editing",
    category: "Video Editing",
    rate: 500,
    description:
      "I will edit short Instagram reels with captions, transitions and music.",
    creator: "Aarav",
    createdAt: Date.now() - 1000,
  },
  {
    id: 2,
    title: "Logo Design",
    category: "Design",
    rate: 800,
    description:
      "Clean and modern logo design for your brand or small business.",
    creator: "Priya",
    createdAt: Date.now() - 2000,
  },
  {
    id: 3,
    title: "Content Writing",
    category: "Writing",
    rate: 400,
    description:
      "SEO-friendly blog posts, captions and website content.",
    creator: "Rohan",
    createdAt: Date.now() - 3000,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [gigs, setGigs] = useState(initialGigs);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  const [newGig, setNewGig] = useState({
    title: "",
    category: "Design",
    rate: "",
    description: "",
  });

  const categories = [
    "All",
    "Design",
    "Video Editing",
    "Writing",
    "Marketing",
  ];

  const filteredGigs = gigs
    .filter((gig) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        gig.title.toLowerCase().includes(searchText) ||
        gig.description.toLowerCase().includes(searchText) ||
        gig.creator.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || gig.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function addGig(e) {
    e.preventDefault();

    if (!newGig.title || !newGig.rate || !newGig.description) {
      showMessage("Please fill all fields.");
      return;
    }

    const gig = {
      id: Date.now(),
      title: newGig.title,
      category: newGig.category,
      rate: Number(newGig.rate),
      description: newGig.description,
      creator: "You",
      createdAt: Date.now(),
    };

    setGigs([gig, ...gigs]);

    setNewGig({
      title: "",
      category: "Design",
      rate: "",
      description: "",
    });

    showMessage("Gig posted successfully!");
    setActiveTab("marketplace");
  }

  function bookGig(gig) {
    const existing = bookings.find(
      (booking) =>
        booking.gigId === gig.id &&
        (booking.status === "Pending" ||
          booking.status === "Accepted")
    );

    if (existing) {
      showMessage("This gig is already booked or pending.");
      return;
    }

    const booking = {
      id: Date.now(),
      gigId: gig.id,
      gigTitle: gig.title,
      creator: gig.creator,
      client: "You",
      status: "Pending",
    };

    setBookings([...bookings, booking]);

    showMessage("Booking request sent!");
    setActiveTab("bookings");
  }

  function updateBooking(id, status) {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? { ...booking, status }
          : booking
      )
    );

    showMessage(
      status === "Accepted"
        ? "Booking accepted!"
        : "Booking declined."
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff] text-slate-900">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          {/* LOGO */}
          <button
            onClick={() => setActiveTab("marketplace")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-violet-200">
              G
            </div>

            <div className="text-left">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Gig<span className="text-violet-600">Swap</span>
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Creator Marketplace
              </p>
            </div>
          </button>

          {/* HEADER BUTTONS */}
          <div className="hidden items-center gap-3 sm:flex">

            <button
              onClick={() => setActiveTab("marketplace")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              Marketplace
            </button>

            <button
              onClick={() => setActiveTab("post")}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              + Post a Gig
            </button>
          </div>
        </div>
      </header>

      {/* ================= NAVIGATION ================= */}
      <nav className="border-b border-violet-100 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 md:px-8">

          <NavButton
            active={activeTab === "marketplace"}
            onClick={() => setActiveTab("marketplace")}
          >
            🔎 Browse & Search
          </NavButton>

          <NavButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Creator Dashboard
          </NavButton>

          <NavButton
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          >
            📋 My Bookings
          </NavButton>
        </div>
      </nav>

      {/* ================= MOBILE POST BUTTON ================= */}
      <div className="fixed bottom-5 right-5 z-30 sm:hidden">
        <button
          onClick={() => setActiveTab("post")}
          className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-bold text-white shadow-xl shadow-violet-300"
        >
          + Post Gig
        </button>
      </div>

      {/* ================= MESSAGE ================= */}
      {message && (
        <div className="fixed right-5 top-24 z-50 flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-2xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
            ✓
          </span>

          {message}
        </div>
      )}

      {/* ================= MARKETPLACE ================= */}
      {activeTab === "marketplace" && (
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

          {/* HERO */}
          <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 px-6 py-10 text-white shadow-2xl shadow-violet-200 md:px-10 md:py-14">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />

            <div className="relative max-w-3xl">

              <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                ✨ POWERED BY YOUNG CREATORS
              </div>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Find talent.
                <br />
                <span className="text-violet-200">
                  Swap skills. Build faster.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-violet-100 md:text-base">
                Discover talented creators, hire them for your next
                project, or turn your own skills into a gig.
              </p>

              <button
                onClick={() => setActiveTab("post")}
                className="mt-7 rounded-xl bg-white px-6 py-3 font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start Selling →
              </button>
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              <span className="text-sm font-bold uppercase tracking-wider text-violet-600">
                Marketplace
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Find the right creator
            </h2>

            <p className="mt-2 text-slate-500">
              Discover services from talented young creators.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mb-10 grid gap-4 md:grid-cols-3">

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gigs, creators..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="flex items-center rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-sm font-semibold text-violet-700">
              ✦ Showing newest gigs first
            </div>
          </div>

          {/* STATS */}
          <div className="mb-8 grid grid-cols-3 gap-3 md:gap-5">

            <StatCard
              number={gigs.length}
              label="Active Gigs"
            />

            <StatCard
              number={new Set(gigs.map((gig) => gig.creator)).size}
              label="Creators"
            />

            <StatCard
              number={bookings.length}
              label="Bookings"
            />
          </div>

          {/* GIG CARDS */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onBook={() => bookGig(gig)}
              />
            ))}
          </div>

          {filteredGigs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
                🔎
              </div>

              <h3 className="text-xl font-bold">
                No gigs found
              </h3>

              <p className="mt-2 text-slate-500">
                Try another search or category.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ================= POST GIG ================= */}
      {activeTab === "post" && (
        <section className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">

          <div className="mb-8">
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-600">
              Creator Studio
            </div>

            <h2 className="text-4xl font-black">
              Post a Gig
            </h2>

            <p className="mt-2 text-slate-500">
              Turn your skills into opportunities.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/50 md:p-8">

            <form onSubmit={addGig} className="space-y-6">

              <Field
                label="Gig title"
                value={newGig.title}
                onChange={(e) =>
                  setNewGig({
                    ...newGig,
                    title: e.target.value,
                  })
                }
                placeholder="Example: YouTube Video Editing"
              />

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Category
                </label>

                <select
                  value={newGig.category}
                  onChange={(e) =>
                    setNewGig({
                      ...newGig,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  {categories
                    .filter((x) => x !== "All")
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>
              </div>

              <Field
                label="Rate (₹)"
                type="number"
                value={newGig.rate}
                onChange={(e) =>
                  setNewGig({
                    ...newGig,
                    rate: e.target.value,
                  })
                }
                placeholder="500"
              />

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Description
                </label>

                <textarea
                  value={newGig.description}
                  onChange={(e) =>
                    setNewGig({
                      ...newGig,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your service..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Publish Gig 🚀
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ================= CREATOR DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">

          <div className="mb-8">
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-600">
              Creator Studio
            </div>

            <h2 className="text-4xl font-black">
              Creator Dashboard
            </h2>

            <p className="mt-2 text-slate-500">
              Manage incoming client booking requests.
            </p>
          </div>

          {bookings.length === 0 ? (
            <Empty text="No incoming bookings yet." />
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/40"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                        BOOKING REQUEST
                      </div>

                      <h3 className="text-xl font-black">
                        {booking.gigTitle}
                      </h3>

                      <p className="mt-2 text-slate-500">
                        Client:{" "}
                        <span className="font-semibold text-slate-700">
                          {booking.client}
                        </span>
                      </p>

                      <p className="mt-3 font-semibold">
                        Status:{" "}
                        <StatusBadge status={booking.status} />
                      </p>
                    </div>

                    {booking.status === "Pending" && (
                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            updateBooking(
                              booking.id,
                              "Accepted"
                            )
                          }
                          className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                        >
                          ✓ Accept
                        </button>

                        <button
                          onClick={() =>
                            updateBooking(
                              booking.id,
                              "Declined"
                            )
                          }
                          className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= MY BOOKINGS ================= */}
      {activeTab === "bookings" && (
        <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">

          <div className="mb-8">
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-violet-600">
              Your Activity
            </div>

            <h2 className="text-4xl font-black">
              My Bookings
            </h2>

            <p className="mt-2 text-slate-500">
              Track all your booking requests.
            </p>
          </div>

          {bookings.length === 0 ? (
            <Empty text="You haven't booked any gig yet." />
          ) : (
            <div className="space-y-5">

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/40"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-600">
                       GIG BOOKING
                      </div>

                      <h3 className="text-xl font-black">
                        {booking.gigTitle}
                      </h3>

                      <p className="mt-1 text-slate-500">
                        Creator:{" "}
                        <span className="font-semibold text-slate-700">
                          {booking.creator}
                        </span>
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  {booking.status === "Declined" && (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                      This creator declined your booking request.
                      You can browse the marketplace and book another gig.
                    </div>
                  )}

                  {booking.status === "Accepted" && (
                    <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
                      🎉 Your booking has been accepted!
                    </div>
                  )}

                  {booking.status === "Pending" && (
                    <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-medium text-orange-700">
                      ⏳ Waiting for the creator to respond.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-violet-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-slate-500 md:flex-row md:px-8">
          <div className="font-bold text-slate-700">
            Gig<span className="text-violet-600">Swap</span>
          </div>

          <p>
            Built for creators. Built for the future. ✨
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ================= NAV BUTTON ================= */

function NavButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-violet-100 text-violet-700"
          : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
      }`}
    >
      {children}
    </button>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ number, label }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
      <div className="text-2xl font-black text-violet-700 md:text-3xl">
        {number}
      </div>

      <div className="mt-1 text-xs font-semibold text-slate-500 md:text-sm">
        {label}
      </div>
    </div>
  );
}

/* ================= GIG CARD ================= */

function GigCard({ gig, onBook }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-100">

      {/* TOP GRADIENT */}
      <div className="h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500" />

      <div className="flex flex-1 flex-col p-6">

        <div className="mb-5 flex items-center justify-between">

          <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
            {gig.category}
          </span>

          <span className="text-xl font-black text-slate-900">
            ₹{gig.rate}
          </span>
        </div>

        <h3 className="text-xl font-black tracking-tight">
          {gig.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
          {gig.description}
        </p>

        <div className="my-5 h-px bg-slate-100" />

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-black text-white">
              {gig.creator.charAt(0)}
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Created by
              </p>

              <p className="text-sm font-bold text-slate-700">
                {gig.creator}
              </p>
            </div>
          </div>

          <button
            onClick={onBook}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:shadow-lg"
          >
            Book Gig →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }) {
  const style =
    status === "Accepted"
      ? "bg-green-100 text-green-700"
      : status === "Declined"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${style}`}
    >
      {status}
    </span>
  );
}

/* ================= EMPTY ================= */

function Empty({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-14 text-center shadow-sm">

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
        📋
      </div>

      <p className="font-semibold text-slate-600">
        {text}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        Your activity will appear here.
      </p>
    </div>
  );
}