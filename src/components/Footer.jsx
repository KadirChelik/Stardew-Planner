import React from 'react';
import Logo from '../assets/Logo_son.png';

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-content'>
            <div className='footer-left'>
            <a className='logo-footer' href=""><img src={Logo} alt="" /></a>
            </div>
            <div className='footer-right'>
            <div className='footer-links-container'>
            <div className="footer-header">Hakkımızda</div>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Biz Kimiz?</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>
          <div className='footer-links-container'>
            <div className="footer-header">Destek</div>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">SSS</a></li>
              <li><a href="#" className="footer-link">İletişim</a></li>
            </ul>
          </div>
          <div className='footer-links-container'>
            <div className="footer-header">Hizmetler</div>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Gizlilik Politikası</a></li>
              <li><a href="#" className="footer-link">Kullanım Şartları</a></li>
            </ul>
          </div>
          <div className='footer-links-container'>
            <div className="footer-header">Takip Et</div>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Twitter</a></li>
              <li><a href="#" className="footer-link">Instagram</a></li>
            </ul>
          </div>
        </div>
            </div>
            <div>&copy; {new Date().getFullYear()} Stardew Planner. All rights reserved.</div>
        </footer>
    );
};

export default Footer;