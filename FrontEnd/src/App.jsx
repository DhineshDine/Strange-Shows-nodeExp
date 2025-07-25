import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminTicketBooking from "./pages/AdminTicketBooking.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShowTimesManagement from "./pages/ShowTimesManagement.jsx";
import FoodManagement from "./pages/FoodManagement.jsx";
import Checkout from "./pages/Checkout.jsx";
import InsightsTracker from "./pages/InsightsTracker.jsx";
import FoodOrdering from "./pages/FoodOrdering.jsx";
import FoodCheckOut from "./pages/FoodCheckOut.jsx";
import LocationManagement from "./pages/LocationManagement";
import LocationsList from "./pages/LocationList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Navigation.jsx";
import SeasonPass from './pages/SeasonPass';
import PassRegister from "./pages/PassRegister.jsx";
import NowPlaying from "./pages/NowPlaying.jsx";
import NowPlayingAdmin from "./pages/NowPlayingAdmin.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Footer from "./components/Navigation/Footer.jsx";
import LayoutNavbar from "./components/LayoutNavbar.jsx";
import Profile from "./pages/Profile.jsx";
import Calendar from "./pages/Calender/Calendar.jsx"

import TicketCheckoutPage from "./pages/TicketCheckoutPage.jsx"
import AddEventModal from "./pages/Calender/AddEventModal.jsx";
import EventCard from "./pages/Calender/EventCard.jsx";
import AdminMovieCalendar from "./pages/Calender/AdminMovieCalendar.jsx";
import OnlyAtStrangeAdmin from "./pages/OnlyAtStrangeAdmin.jsx";
import NovPlayingBookingPage from "./pages/NovPlayingBookingPage.jsx";
import ReviewSkeletonLoader from "./pages/Reviews/ReviewSkeletonLoader.jsx";
import ReviewMovieCompact from "./pages/Reviews/ReviewMovieCompact.jsx";
import ReviewLayoutNavbar from "./pages/Reviews/ReviewLayoutNavbar.jsx";
import ReviewFooter from "./pages/Reviews/ReviewFooter.jsx";
import AdminComingSoon from "./pages/AdminComingSoon.jsx";
import ReviewPage from "./pages/Reviews/ReviewPage.jsx";
import SecretHouse from "./pages/TerraceShows/SecretHouse.jsx";
import MovieToggle from "./pages/MovieToggle.jsx";
import TerraceShows from "./pages/TerraceShows/TerraceShows.jsx";
const App = () => {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/movie-showtimes" element={<ShowTimesManagement />} />
                <Route path="/food-management" element={<FoodManagement />} />
                <Route path="/insights" element={<InsightsTracker />} />
                <Route path="/check-out" element={<Checkout />} />
                <Route path="/seasonpass" element={<SeasonPass />} />
                <Route path="/pass-register" element={<PassRegister />} />
                <Route path="/coming-soon" element={<ComingSoon/>} />
                <Route path="/comingsoon" element={<AdminComingSoon />} />
                <Route path="/now-playing" element={<NowPlaying />} />
                <Route path="/admin-now-palying" element={<NowPlayingAdmin />} />
                <Route path="/reviews" element={<ReviewPage />} />
                <Route path="/secret-house" element={<SecretHouse />} />
                <Route path="/nov-booking" element={<NovPlayingBookingPage />} />
                <Route path="/checkout" element={<TicketCheckoutPage />} />

                <Route path="/onlyAtStrange" element={<OnlyAtStrangeAdmin />} />
                <Route path="/movie-toggle" element={<MovieToggle/>} />
                <Route path="/admin-calender" element={<AdminMovieCalendar />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/add-event-model" element={<AddEventModal />} />

                <Route path="/event-card" element={<EventCard />} />
                <Route path="/monthly-calendar" element={<Calendar />} />

                <Route path="/footer" element={<Footer />} />
                <Route path="/layout-navbar" element={<LayoutNavbar />} />
                <Route path="/terrace-shows" element={<TerraceShows />} />

                <Route path="/food" element={<FoodOrdering />} />
                <Route path="/food-check-out" element={<FoodCheckOut />} />
                <Route path="/location-list" element={<LocationsList />} />
                <Route path="/location-management" element={<LocationManagement />} />
                <Route path="/admin-ticket-booking" element={<AdminTicketBooking />} />
                <Route path="/nav" element={<Navigation/>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </>
    );
};

export default App;
