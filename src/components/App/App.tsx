// import { useState } from 'react'
import NoteList from '../NoteList/NoteList';
import css from './App.module.css'

export default function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <NoteList/>
        {/* Компонент SearchBox */}
        {/* Пагінація */}
        {/* Кнопка створення нотатки */}
      </header>
    </div>
  );
}