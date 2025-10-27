import { useState, useEffect } from 'react'

const WORDS = [
	'GHOST',
	'WITCH',
	'VAMPIRE',
	'ZOMBIE',
	'HAUNTED',
	'SKELETON',
	'PHANTOM',
	'CREEPY',
	'DARKNESS',
	'SHADOW',
	'SPOOKY',
	'GRAVEYARD',
	'PUMPKIN',
	'MONSTER',
	'COBWEB',
]

export default function Hangman() {
	const [word, setWord] = useState('')
	const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
	const [wrongGuesses, setWrongGuesses] = useState(0)
	const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(
		'playing'
	)

	const maxWrongGuesses = 6

	useEffect(() => {
		startNewGame()
	}, [])

	const startNewGame = () => {
		const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
		setWord(randomWord)
		setGuessedLetters(new Set())
		setWrongGuesses(0)
		setGameStatus('playing')
	}

	const handleGuess = (letter: string) => {
		if (gameStatus !== 'playing' || guessedLetters.has(letter)) return

		const newGuessedLetters = new Set(guessedLetters)
		newGuessedLetters.add(letter)
		setGuessedLetters(newGuessedLetters)

		if (!word.includes(letter)) {
			const newWrongGuesses = wrongGuesses + 1
			setWrongGuesses(newWrongGuesses)

			if (newWrongGuesses >= maxWrongGuesses) {
				setGameStatus('lost')
			}
		} else {
			const allLettersGuessed = word
				.split('')
				.every((l) => newGuessedLetters.has(l))
			if (allLettersGuessed) {
				setGameStatus('won')
			}
		}
	}

	const displayWord = word
		.split('')
		.map((letter) => (guessedLetters.has(letter) ? letter : '_'))
		.join(' ')

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

	return (
		<div style={styles.gameBox}>
			<div style={styles.guessCounter}>
				wrong guesses:{' '}
				<span style={styles.wrongCount}>
					{wrongGuesses} / {maxWrongGuesses}
				</span>
			</div>
			{gameStatus !== 'playing' && (
				<div
					style={{
						...styles.statusBox,
						...(gameStatus === 'won'
							? styles.statusWon
							: styles.statusLost),
					}}
				>
					<span style={styles.statusText}>
						{gameStatus === 'won'
							? '🎃 Correct!'
							: `💀 Game Over! The word was: ${word}`}
					</span>
				</div>
			)}
			<div style={styles.wordDisplay}>{displayWord}</div>

			<div style={styles.keyboard}>
				{alphabet.map((letter) => {
					const isGuessed = guessedLetters.has(letter)
					const isCorrect = isGuessed && word.includes(letter)
					const isWrong = isGuessed && !word.includes(letter)

					let buttonStyle = { ...styles.letterButton }

					if (isCorrect) {
						buttonStyle = {
							...buttonStyle,
							...styles.correctButton,
						}
					} else if (isWrong) {
						buttonStyle = {
							...buttonStyle,
							...styles.wrongButton,
						}
					} else if (gameStatus !== 'playing') {
						buttonStyle = {
							...buttonStyle,
							...styles.disabledButton,
						}
					}

					return (
						<button
							key={letter}
							onClick={() => handleGuess(letter)}
							disabled={isGuessed || gameStatus !== 'playing'}
							style={buttonStyle}
						>
							{letter}
						</button>
					)
				})}
			</div>

			<button onClick={startNewGame} style={styles.newGameButton}>
				New Game
			</button>
		</div>
	)
}

const styles: { [key: string]: React.CSSProperties } = {
	gameBox: {
		borderRadius: 'var(--spacing-3xs)',
		maxWidth: '700px',
		width: '100%',
		marginInline: 'auto',
	},
	guessCounter: {
		textAlign: 'right',
		fontSize: 'var(--text-step--2)',
		marginBottom: 'var(--spacing-2xs)',
	},
	wrongCount: {
		fontWeight: 'bold',
		color: 'var(--orange-400)',
	},
	wordDisplay: {
		textAlign: 'center',
		fontSize: 'var(--text-step-3)',
		fontFamily: 'monospace',
		fontWeight: 'bold',
		letterSpacing: '4px',
		marginBottom: 'var(--spacing-l)',
		minHeight: '60px',
	},
	statusBox: {
		padding: 'var(--spacing-xs) var(--spacing-3xs)',
		textAlign: 'center',
	},
	statusWon: {
		color: 'var(--lime-400)',
	},
	statusLost: {
		color: 'var(--orange-400)',
	},
	statusText: {
		fontSize: 'var(--text-step-1)',
	},
	keyboard: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, 1fr)',
		gap: '6px',
		marginBottom: 'var(--spacing-l)',
	},
	letterButton: {
		padding: 'var(--spacing-xs)',
		borderRadius: 'var(--spacing-3xs)',
		fontWeight: 'bold',
		fontSize: 'var(--text-step--1)',
		border: 'none',
		cursor: 'pointer',
		backgroundColor: 'var(--lavender-300)',
		color: 'var(--black-500)',
		transition: 'all 0.2s',
	},
	correctButton: {
		backgroundColor: 'var(--lime-400)',
		cursor: 'not-allowed',
	},
	wrongButton: {
		backgroundColor: 'var(--black-400)',
		cursor: 'not-allowed',
	},
	disabledButton: {
		backgroundColor: 'var(--black-300)',
		cursor: 'not-allowed',
	},
	newGameButton: {
		width: '100%',
		backgroundColor: 'var(--pink-400)',
		color: 'var(--black-500)',
		fontWeight: 'bold',
		padding: 'var(--spacing-xs) var(--spacing-3xs)',
		borderRadius: 'var(--spacing-3xs)',
		border: 'none',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 'var(--text-step--1)',
		transition: 'all 0.2s',
	},
}
