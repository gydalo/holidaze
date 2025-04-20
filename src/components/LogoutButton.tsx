import { useAuth } from '../api/auth/useAuth';
import ReusableButton from './ReusableButton';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <ReusableButton onClick={logout}>
      Logout
    </ReusableButton>
  );
};

export default LogoutButton;