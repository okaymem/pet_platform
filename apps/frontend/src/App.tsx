import { useEffect, useState } from "react";
import PetList from "./components/PetList";
import BottomNav from "./components/BottomNav";
type Page = "profile" | "pets";
import Profile from "./components/Profile";
import PetDetails from "./components/PetDetails";
import CreatePet from "./components/CreatePet";
import {
  authenticateWithTelegram,
  getMe,
  type User,
} from "./api/auth";
import { getPets, type Pet } from "./api/pets";

function App() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [pets, setPets] = useState<Pet[]>([]);
const [currentPage, setCurrentPage] = useState<Page>("profile");
const [isCreatingPet, setIsCreatingPet] = useState(false);

useEffect(() => {
    async function initializeApp() {
      try {
        const webApp = window.Telegram.WebApp;

        webApp.ready();

        await authenticateWithTelegram(webApp.initData);

        const currentUser = await getMe();

        setUser(currentUser);

        const currentPets = await getPets();

        setPets(currentPets);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    initializeApp();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
  <main className="h-[100dvh] overflow-hidden bg-gray-50">
    <div className="mx-auto h-full w-full max-w-md overflow-y-auto px-4 pt-6 pb-28">
      {currentPage === "profile" && <Profile user={user} />}

      {currentPage === "pets" && !isCreatingPet && !selectedPet && (
  <PetList
    pets={pets}
    onAddPet={() => setIsCreatingPet(true)}
    onPetClick={(pet) => {
      setSelectedPet(pet)
     }}
  />
)}

{currentPage === "pets" && !isCreatingPet && selectedPet && (
  <PetDetails
    pet={selectedPet}
    onBack={() => setSelectedPet(null)}
    onPetUpdated={(updatedPet) => {
    setSelectedPet(updatedPet);

    setPets((current) =>
      current.map((pet) =>
        pet.id === updatedPet.id
          ? updatedPet
          : pet,
      ),
    );
  }}
  />
)}

      {currentPage === "pets" && isCreatingPet && (
        <CreatePet
          onCancel={() => setIsCreatingPet(false)}
          onPetCreated={async (pet) => {
            const currentPets = await getPets();

            setPets(currentPets);
            setIsCreatingPet(false);
          }}
        />
      )}
    </div>

    {(!isCreatingPet && !selectedPet) && (
      <BottomNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )}
  </main>
);
}

export default App;