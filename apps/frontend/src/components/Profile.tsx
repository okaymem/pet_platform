import type { User } from "../api/auth";

type ProfileProps = {
  user: User;
};

function Profile({ user }: ProfileProps) {
  const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

  const photoUrl = telegramUser?.photo_url;

  return (
    <section className="mx-auto w-full max-w-md px-2 py-4">
      <div className="mb-8">
        

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Profile
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-5xl">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={user.firstName}
                className="h-full w-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>

          <h2 className="text-2xl font-bold">
            {user.firstName}
          </h2>

          {user.username && (
            <p className="mt-1 text-gray-500">
              @{user.username}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-3">
          

          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {user.firstName}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Username
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {user.username ? `@${user.username}` : "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;

