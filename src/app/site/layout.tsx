import Navigation from '@/components/site/navigation'

const layout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  )
}

export default layout
