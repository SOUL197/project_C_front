import { JSX } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { member, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>인증 정보 확인 중...</div>;
    }

    if (!member) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};
export default RequireAuth;