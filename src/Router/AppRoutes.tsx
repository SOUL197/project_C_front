import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../conts/home/Home'
import MatchingHome from '../conts/matching/MatchingHome'
import MatchingDetail from '../conts/matching/MatchingDetail'
import Alarm from '../conts/matching/Alarm'
import UpboardList from '../conts/upboard/UpboardList'
import UpboardDetail from '../conts/upboard/UpboardDetail'
import Gallery from '../conts/gallery/Gallery'
import GalleryDetail from '../conts/gallery/GallerryDetail'
import GalleryForm from '../conts/gallery/GalleryForm'
import UpboardForm from '../conts/upboard/UpboardForm'
import Fortune from '../conts/fortune/Fortune'
import Signup from '../conts/signup/Signup'
import Login from '../conts/login/Login'
import Gongjilist from '../conts/gongji/Gongjilist'
import GongjiForm from '../conts/gongji/GongjiForm'
import GongjiDetail from '../conts/gongji/GongjiDetail'
import FAQ from '../conts/faq/Faq'
import FaqForm from '../conts/faq/FaqForm'
import Mypagedetail from '../conts/mypage/Mypagedetail'
import LikeHome from '../conts/Like/LikeHome'
import LikeDetail from '../conts/Like/LikeDetail'
import AdminAnswer from '../conts/faq/AdminAnswer'
import MyQna from '../conts/faq/MyQna'
import Mypagehome from '../conts/mypage/Mypagehome'
import FindId from '../conts/login/FindId'
import FindPwd from '../conts/login/FindPwd'
import MyPageStats from '../conts/chart_ui/MyPageStats'
import AdminDashboard from '../conts/chart_ui/AdminDashboard'
import VisiorChart from '../conts/chart_ui/VisiorChart'
import QnaForm from '../conts/faq/QnaForm'
import QnaList from '../conts/faq/QnaList'
import SurveyClient from '../conts/survey copy/SurveyClient'
import SurveyList from '../conts/survey copy/SurveyList'
import SurveyAddForm from '../conts/survey copy/SurveyAddForm'
import SurveyClientResult from '../conts/survey copy/SurveyClientResult'
import RequireAuth from '../comp/RequiredAuth'

const AppRoutes: React.FC = () => {
    const routelist = [
        { path: '/', element: <Home /> },
        { path: '/matchingHome', element: <RequireAuth><MatchingHome /></RequireAuth> },
        { path: '/matchingHome/:id', element: <RequireAuth><MatchingDetail /></RequireAuth> },
        { path: '/alarm', element: <RequireAuth><Alarm /></RequireAuth> },
        { path: '/community/uplist', element: <UpboardList /> },
        { path: '/community/updetail/:num', element: <RequireAuth><UpboardDetail /></RequireAuth> },
        { path: '/gallery', element: <Gallery /> },
        { path: '/gallery/write', element: <RequireAuth><GalleryForm /></RequireAuth> },
        { path: '/gallery/gdetail/:num', element: <RequireAuth><GalleryDetail /></RequireAuth> },
        { path: '/community/upform', element: <RequireAuth><UpboardForm /></RequireAuth> },
        { path: '/vchart', element: <VisiorChart /> },
        { path: '/fortune', element: <Fortune /> },
        { path: '/mypage', element: <RequireAuth><Mypagehome /></RequireAuth> },
        { path: '/signup', element: <Signup /> },
        { path: '/findId', element: <FindId /> },
        { path: '/findPwd', element: <FindPwd /> },
        { path: '/login', element: <Login /> },
        { path: '/gongji', element: <Gongjilist /> },
        { path: '/gongji/form', element: <RequireAuth><GongjiForm /></RequireAuth> },
        { path: '/gongji/detail/:num', element: <GongjiDetail /> },
        { path: '/faq', element: <FAQ /> },
        { path: '/faq/form', element: <RequireAuth><FaqForm /></RequireAuth> },
        { path: '/like', element: <RequireAuth><LikeHome /></RequireAuth> },
        { path: '/like/detail/:num', element: <RequireAuth><LikeDetail /></RequireAuth> },
        { path: '/adminanswer', element: <AdminAnswer /> },
        { path: '/myqna', element: <RequireAuth><QnaList /></RequireAuth> },
        { path: '/qnaform', element: <RequireAuth><QnaForm /></RequireAuth> },
        { path: '/surveyclient/:num', element: <RequireAuth><SurveyClient /></RequireAuth> },
        { path: '/surveylist', element: <SurveyList /> },
        { path: '/surveyaddform', element: <RequireAuth><SurveyAddForm /></RequireAuth> },
        { path: '/surveyresult/:num', element: <RequireAuth><SurveyClientResult /></RequireAuth> },
    ]

    return (
        <Routes>
            {
                routelist.map((route, i) => (
                    <Route key={i}{...route} />
                ))
            }
        </Routes>
    )
}

export default AppRoutes