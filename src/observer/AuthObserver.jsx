import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setUser } from './features/auth/authSlice';
import auth from './Firebase/Firebase.init';

const AuthObserver = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      dispatch(setLoading(true));
      dispatch(setUser(currentUser));

      if (currentUser?.email) {
        await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/jwt`, { email: currentUser.email }, { withCredentials: true });
      } else {
        await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/logout`, { withCredentials: true });
      }

      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default AuthObserver;
