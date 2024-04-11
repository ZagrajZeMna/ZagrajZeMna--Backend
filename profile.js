/*//const router = express.Router();
const pool = require('./db');

// Middleware sprawdzający, czy użytkownik jest zalogowany
// Zakładam, że masz już gdzieś zdefiniowany middleware `checkNotAuthenticated`
//const { checkNotAuthenticated } = require('./authMiddleware');

// Middleware do parsowania ciała zapytania POST (formularzy)
//router.use(express.urlencoded({ extended: true }));

// Funkcja kontrolera do aktualizacji nicku
async function postEditUserNickname(req, res, next) {
    const userId = req.user.id; // Pobierz ID zalogowanego użytkownika
    const updateName = req.body.name; // Pobierz nowy nick z formularza

    // Konstrukcja zapytania SQL do aktualizacji nicku użytkownika
    const updateQuery = 'UPDATE users SET name = $1 WHERE id = $2';

    try {
        // Wykonanie zapytania SQL za pomocą poola
        const result = await pool.query(updateQuery, [updateName, userId]);

        if (result.rowCount === 0) {
            // Jeżeli rowCount jest 0, oznacza to, że użytkownik nie został znaleziony.
            return res.status(404).send('Nie znaleziono użytkownika.');
        }

        console.log(`Nick updated to: ${updateName}`);
        res.redirect('/users/dashboard'); // Przekierowanie do strony z informacjami
    } catch (err) {
        // Obsługa błędów
        console.error('Error during the nickname update', err.stack);
        const error = new Error('Wystąpił błąd podczas aktualizacji nicku.');
        error.httpStatusCode = 500;
        return next(error); // Przekazanie błędu do obsługi błędów w Express
    }
}

// Definicja trasy POST dla formularza edycji nicku
//router.post('/dashboard/edit', checkNotAuthenticated, postEditUserNickname);

// Eksportowanie routera
module.exports = postEditUserNickname;*/
