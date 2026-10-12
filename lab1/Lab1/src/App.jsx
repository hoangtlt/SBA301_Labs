import AppNavBar from "./components/AppNavBar";
import OrchidList from "./components/OrchidList";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <AppNavBar />

      <main>
        <OrchidList />
      </main>

      <Footer />
    </>
  );
}

export default App;