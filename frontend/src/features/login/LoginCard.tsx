export function LoginCard() {
  return (
    <>
      <div className="card bg-primary w-96">
        <div className="card-body">
          {/* Center the title and description - FLEX CONTAINER */}
          <div className="flex flex-col items-center text-center">
            <p className="card-title">Login</p>
            <p>Enter your email and password</p>
          </div>

          <div className="mt-4 flex flex-col">
            {/* Email field - left aligned within the centered container */}
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-left">Email</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Email here"
                />
              </fieldset>
            </div>

            {/* Password field - left aligned within the centered container */}
            <div className="mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-left">Password</legend>
                <input
                  type="password"
                  className="input w-full"
                  placeholder="Password here"
                />
              </fieldset>
            </div>

            {/* Button centered */}
            <div className="mt-6 flex justify-center">
              <button className="btn btn-wide">Log in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
