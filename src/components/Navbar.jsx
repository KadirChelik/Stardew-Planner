import React from 'react';
import home from '../assets/home3.png';
import profile from '../assets/profile.png';
import calendar from '../assets/calendar.png';
import task from '../assets/task.png';
import stats from '../assets/stats.png';
import settings from '../assets/settings.png';
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <a href="/about"><img src={home} alt="" /> Ana Sayfa</a>
                <a href="/features"><img src={profile} alt="" /> Profil</a>
                <a href="/contact"><img src={calendar} alt="" /> Takvim</a>
                <a href="/contact"><img src={task} alt="" /> Görevler</a>
                <a href="/contact"><img src={stats} alt="" /> İstatistikler</a>
                <a href="/contact"><img src={settings} alt="" /> Ayarlar</a>
            </div>
        </nav>
    );
};

export default Navbar;