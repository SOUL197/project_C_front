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
import Chart from '../conts/chart_ui/Chart'
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
import Mypagehome from '../conts/mypage/Mypagehome (1)'
import FindId from '../conts/login/FindId'
import FindPwd from '../conts/login/FindPwd'
import TestChart from '../conts/chart_ui/TestChart'
import TestChart2 from '../conts/chart_ui/TestChart2'
import MyPageStats from '../conts/chart_ui/MyPageStats'
import AdminDashboard from '../conts/chart_ui/AdminDashboard'
import QnaForm from '../conts/faq/QnaForm'
import QnaList from '../conts/faq/QnaList'
import SurveyClient from '../conts/survey copy/SurveyClient'
import SurveyList from '../conts/survey copy/SurveyList'
import SurveyAddForm from '../conts/survey copy/SurveyAddForm'
import SurveyClientResult from '../conts/survey copy/SurveyClientResult'


const AppRoutes: React.FC = () => {
    const routelist = [
        { path: '/', element: <Home /> },
        { path: '/matchingHome', element: <MatchingHome /> },
        { path: '/matchingHome/:id', element: <MatchingDetail /> },
        { path: '/alarm', element: <Alarm /> },
        { path: '/community/uplist', element: <UpboardList /> },
        { path: '/community/updetail/:num', element: <UpboardDetail /> },
        { path: '/gallery', element: <Gallery /> },
        { path: '/gallery/write', element: <GalleryForm /> },
        { path: '/gallery/gdetail/:num', element: <GalleryDetail /> },
        { path: '/community/upform', element: <UpboardForm /> },
        { path: '/vchart', element: <TestChart2 /> },
        { path: '/fortune', element: <Fortune /> },
        { path: '/mypage', element: <Mypagehome /> },
        { path: '/mypage/detail', element: <Mypagedetail /> },
        { path: '/signup', element: <Signup /> },
        { path: '/findId', element: <FindId /> },
        { path: '/findPwd', element: <FindPwd /> },
        { path: '/login', element: <Login /> },
        { path: '/gongji', element: <Gongjilist /> },
        { path: '/gongji/form', element: <GongjiForm /> },
        { path: '/gongji/detail/:num', element: <GongjiDetail /> },
        { path: '/faq', element: <FAQ /> },
        { path: '/faq/form', element: <FaqForm /> },
        { path: '/like', element: <LikeHome /> },
        { path: '/like/detail/:num', element: <LikeDetail /> },
        { path: '/adminanswer', element: <AdminAnswer /> },
        { path: '/myqna', element: <QnaList /> },
        { path: '/qnaform', element: <QnaForm /> },
        { path: '/test2', element: <MyPageStats /> },
        { path: '/test3', element: <AdminDashboard /> },
        { path: '/surveyclient/:num', element: <SurveyClient /> },
        { path: '/surveylist', element: <SurveyList /> },
        { path: '/surveyaddform', element: <SurveyAddForm /> },
        { path: '/surveyresult/:num', element: <SurveyClientResult /> },
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