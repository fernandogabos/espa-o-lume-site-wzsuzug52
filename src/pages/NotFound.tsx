import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-lume-deep-blue/10">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-lume-deep-blue">
            Página não encontrada
          </h2>
          <p className="text-gray-500">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Button
          asChild
          className="bg-lume-deep-blue hover:bg-lume-deep-blue/90"
        >
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Voltar para o Início
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
