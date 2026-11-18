
from datetime import date, timedelta

from database import get_connection, create_tables


# A határidők mindig az aktuális naphoz képest számolódnak.
today = date.today()

mock_tasks = [
    # MAGAS PRIORITÁS
    ("Weboldal főoldalának befejezése", "A főoldal végleges dizájnja és reszponzív ellenőrzése.", "high", 0, 3),
    ("Ügyfélprezentáció elkészítése", "Prezentáció összeállítása a pénteki megbeszélésre.", "high", 0, 1),
    ("Adatbázis biztonsági mentése", "Automatikus mentési folyamat ellenőrzése.", "high", 1, -2),
    ("Projekt határidőinek áttekintése", "A csúszásban lévő feladatok ellenőrzése.", "high", 0, -4),
    ("Fizetési hiba javítása", "A fizetési folyamat hibájának kivizsgálása.", "high", 0, 0),
    ("Szerverfrissítés", "A szervercsomagok frissítése és tesztelése.", "high", 1, 7),
    ("Fontos dokumentum elküldése", "A végleges dokumentáció továbbítása.", "high", 1, -1),
    ("API hibák javítása", "A backend végpontok tesztelése és javítása.", "high", 0, 2),

    # KÖZEPES PRIORITÁS
    ("TaskFlow navigáció fejlesztése", "A menüpontok és szűrők működésének ellenőrzése.", "medium", 0, 2),
    ("Felhasználói felület finomítása", "Margók, térközök és tipográfia javítása.", "medium", 0, 5),
    ("Dokumentáció frissítése", "A telepítési és használati útmutató frissítése.", "medium", 0, 10),
    ("Új projektötletek összegyűjtése", "Lehetséges következő funkciók listázása.", "medium", 0, None),
    ("Tesztelési terv készítése", "A fő funkciók teszteseteinek összeírása.", "medium", 0, 4),
    ("Ikonok egységesítése", "A különböző ikonméretek és stílusok összehangolása.", "medium", 1, -3),
    ("E-mail sablonok megírása", "Értesítési e-mail sablonok elkészítése.", "medium", 0, 8),
    ("Mobilnézet ellenőrzése", "Az alkalmazás tesztelése kisebb képernyőkön.", "medium", 0, 1),
    ("Kód átnézése", "A felesleges kódrészek és hibák keresése.", "medium", 1, -5),
    ("Heti tervezés", "A következő hét feladatainak összeállítása.", "medium", 0, 7),

    # ALACSONY PRIORITÁS
    ("Asztal rendbetétele", "A munkakörnyezet rendezése.", "low", 0, None),
    ("Régi fájlok archiválása", "A már nem használt projektfájlok rendezése.", "low", 0, 14),
    ("Színek finomhangolása", "A dashboard színpalettájának átnézése.", "low", 1, -2),
    ("Olvasnivalók összegyűjtése", "Hasznos fejlesztői cikkek elmentése.", "low", 0, 21),
    ("Projektmappa rendezése", "A fájlok és mappák áttekinthetőbb elrendezése.", "low", 0, None),
    ("Billentyűparancsok kipróbálása", "Hasznos VS Code parancsok megismerése.", "low", 1, -6),
    ("Ikoncsomagok keresése", "Alternatív ikonstílusok megtekintése.", "low", 0, 12),

    # VEGYES FELADATOK
    ("Bevásárlólista elkészítése", "A hétvégi bevásárlás megtervezése.", "low", 0, 0),
    ("Heti költségvetés áttekintése", "A kiadások és bevételek ellenőrzése.", "medium", 1, -1),
    ("Új funkciók tesztelése", "A feladatok létrehozásának és törlésének ellenőrzése.", "high", 0, 3),
    ("Kávészünet", "Egy kis pihenés a hosszú fejlesztés után.", "low", 1, -7),
    ("Projekt bemutatójának előkészítése", "Képernyőképek és bemutatóanyagok összeállítása.", "medium", 0, 6),
    ("Régi feladatok lezárása", "A már nem aktuális feladatok ellenőrzése.", "low", 1, -10),
]


def seed_database():
    create_tables()
    connection = get_connection()

    try:
        # Csak a korábbi, általunk generált demo feladatokat töröljük.
        connection.execute(
            "DELETE FROM tasks WHERE title LIKE '[DEMO]%'"
        )

        for title, description, priority, completed, due_offset in mock_tasks:
            due_date = (
                (today + timedelta(days=due_offset)).isoformat()
                if due_offset is not None
                else None
            )

            connection.execute(
                """
                INSERT INTO tasks (
                    title,
                    description,
                    priority,
                    completed,
                    due_date
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"[DEMO] {title}",
                    description,
                    priority,
                    completed,
                    due_date,
                ),
            )

        connection.commit()

        print(f"Sikeresen létrehozva {len(mock_tasks)} mintafeladat!")
        print("A korábbi demo feladatok frissítve lettek.")
        print("A saját feladataid változatlanul megmaradtak.")

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


if __name__ == "__main__":
    seed_database()
