import { useState, useEffect } from 'react'
import Head from 'next/head'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses))
    }
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <Head>
        <title>Expense Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container">
        <h1>Expense Tracker</h1>

        <div className="summary">
          <div className="total">
            <span>Total Expenses</span>
            <span className="amount">${total.toFixed(2)}</span>
          </div>
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div key={cat} className="category-sum">
              <span>{cat}</span>
              <span>${amt.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <form onSubmit={addExpense} className="form">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            step="0.01"
            required
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Add Expense</button>
        </form>

        <div className="expenses">
          {expenses.length === 0 ? (
            <p className="empty">No expenses yet. Add one above!</p>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="expense">
                <div className="expense-info">
                  <div className="expense-desc">{expense.description}</div>
                  <div className="expense-meta">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-date">{expense.date}</span>
                  </div>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="delete-btn"
                    aria-label="Delete expense"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
