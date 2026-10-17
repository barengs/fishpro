import { Link } from "react-router-dom";
import { CenteredAuth } from "./components/CenteredAuth";
import { RegisterStepWizard } from "./components/RegisterStepWizard";

export function RegisterPage() {
  return (
    <CenteredAuth register hideBrand>
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="m-0 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-strong">
          Pendaftaran Akun Baru
        </h1>
        <p className="m-0 text-xs sm:text-sm text-soft mt-1">
          Daftarkan akun resmi armada perikanan tangkap dan operasional laut.
        </p>
      </div>
      <RegisterStepWizard />
      <p className="m-0 mt-7 text-center text-sm text-soft">
        Sudah terdaftar?{" "}
        <Link
          to="/login"
          className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
        >
          Masuk
        </Link>
      </p>
    </CenteredAuth>
  );
}
