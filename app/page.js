"use client";

import { useState } from "react";

const initialGigs = [
  {
    id: 1,
    title: "Instagram Reel Editing",
    category: "Video Editing",
    rate: 500,
    description: "I will edit short Instagram reels with captions, transitions and music.",
    creator: "Aarav",
    createdAt: Date.now() - 1000,
  },
  {
    id: 2,
    title: "Logo Design",
    category: "Design",
    rate: 800,
    description: "Clean and modern logo design for your brand or small business.",
    creator: "Priya",
    createdAt: Date.now() - 2000,
  },
  {
    id: 3,
    title: "Content Writing",
    category: "Writing",
    rate: 400,
    description: "SEO-friendly blog posts, captions and website content.",
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

  const categories = ["All", "Design", "Video Editing", "Writing", "Marketing"];

  const filteredGigs = gigs
    .filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || gig.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
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
        (booking.status === "Pending" || booking.status === "Accepted")
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
        booking.id === id ? { ...booking, status } : booking
      )
    );

    showMessage(
      status === "Accepted"
        ? "Booking accepted!"
        : "Booking declined."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">GigSwap</h1>
            <p className="text-sm text-slate-500">
              Creator Gig Marketplace
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("marketplace")}
              className="rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Marketplace
            </button>

            <button
              onClick={() => setActiveTab("post")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + Post a Gig
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 px-6 py-3">
          <NavButton
            active={activeTab === "marketplace"}
            onClick={() => setActiveTab("marketplace")}
          >
            Browse & Search
          </NavButton>

          <NavButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          >
            Creator Dashboard
          </NavButton>

          <NavButton
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </NavButton>
        </div>
      </nav>

      {message && (
        <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-lg">
          {message}
        </div>
      )}

      {/* MARKETPLACE */}
      {activeTab === "marketplace" && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Find the right creator</h2>
            <p className="mt-2 text-slate-500">
              Discover services from talented young creators.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gigs..."
              className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border bg-white px-4 py-3"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="rounded-xl bg-blue-50 px-4 py-3 text-blue-700">
              Showing newest gigs first
            </div>
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
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              No gigs found.
            </div>
          )}
        </section>
      )}

      {/* POST GIG */}
      {activeTab === "post" && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Post a Gig</h2>
            <p className="mb-8 mt-2 text-slate-500">
              List your service and let clients book you.
            </p>

            <form onSubmit={addGig} className="space-y-5">
              <Field
                label="Gig title"
                value={newGig.title}
                onChange={(e) =>
                  setNewGig({ ...newGig, title: e.target.value })
                }
                placeholder="Example: YouTube Video Editing"
              />

              <div>
                <label className="mb-2 block font-medium">Category</label>
                <select
                  value={newGig.category}
                  onChange={(e) =>
                    setNewGig({ ...newGig, category: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-3"
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
                  setNewGig({ ...newGig, rate: e.target.value })
                }
                placeholder="500"
              />

              <div>
                <label className="mb-2 block font-medium">
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
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                Publish Gig
              </button>
            </form>
          </div>
        </section>
      )}

      {/* CREATOR DASHBOARD */}
      {activeTab === "dashboard" && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-3xl font-bold">Creator Dashboard</h2>
          <p className="mb-8 mt-2 text-slate-500">
            Manage incoming client booking requests.
          </p>

          {bookings.length === 0 ? (
            <Empty text="No incoming bookings yet." />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {booking.gigTitle}
                      </h3>

                      <p className="mt-1 text-slate-500">
                        Client: {booking.client}
                      </p>

                      <p className="mt-2 font-medium">
                        Status:{" "}
                        <span
                          className={
                            booking.status === "Accepted"
                              ? "text-green-600"
                              : booking.status === "Declined"
                              ? "text-red-600"
                              : "text-orange-500"
                          }
                        >
                          {booking.status}
                        </span>
                      </p>
                    </div>

                    {booking.status === "Pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateBooking(booking.id, "Accepted")
                          }
                          className="rounded-lg bg-green-600 px-5 py-2 text-white"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            updateBooking(booking.id, "Declined")
                          }
                          className="rounded-lg bg-red-600 px-5 py-2 text-white"
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

      {/* MY BOOKINGS */}
      {activeTab === "bookings" && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-3xl font-bold">My Bookings</h2>
          <p className="mb-8 mt-2 text-slate-500">
            Track all your booking requests.
          </p>

          {bookings.length === 0 ? (
            <Empty text="You haven't booked any gig yet." />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {booking.gigTitle}
                      </h3>

                      <p className="text-slate-500">
                        Creator: {booking.creator}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  {booking.status === "Declined" && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      This creator declined your booking request.
                      You can browse the marketplace and book another gig.
                    </div>
                  )}

                  {booking.status === "Accepted" && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      Your booking has been accepted!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function NavButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function GigCard({ gig, onBook }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {gig.category}
        </span>

        <span className="text-lg font-bold">₹{gig.rate}</span>
      </div>

      <h3 className="text-xl font-bold">{gig.title}</h3>

      <p className="mt-2 text-sm text-slate-500">{gig.description}</p>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-slate-500">
          By {gig.creator}
        </span>

        <button
          onClick={onBook}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Book Gig
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Accepted"
      ? "bg-green-100 text-green-700"
      : status === "Declined"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${style}`}>
      {status}
    </span>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
      {text}
    </div>
  );
}