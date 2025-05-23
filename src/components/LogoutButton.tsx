import { useAuth } from '../api/auth/useAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button className='hover:underline hover:underline-offset-2 cursor-pointer text-sm' onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;