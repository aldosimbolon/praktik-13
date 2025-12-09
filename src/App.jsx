import { useState } from 'react'
import ProductApp from './ProductApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductApp />
    </>
  )
}

export default App
