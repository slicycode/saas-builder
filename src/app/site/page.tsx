import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/libs/constants'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="relative flex flex-col items-center justify-center w-full h-full pt-36">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616,transparent_1px),linear-gradient(to_bottom,#161616,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p className="text-center">Run your agency, in one place</p>
        <div className="relative text-transparent bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plura
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src="/assets/preview.png"
            alt="banner image"
            height={1200}
            width={1200}
            className="border-2 rounded-t-2xl border-muted"
          />
          <div className="absolute bottom-0 left-0 right-0 z-10 top-1/2 bg-gradient-to-t dark:from-background"></div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 md:mt-44 mt-[-40px]">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="max-w-xl text-center text-muted-foreground">
          Our straightforward pricing plans are tailored to your needs. If
          you&apos;re not ready to commit, try our free plan.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': card.title === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': card.title !== 'Unlimited Saas',
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                {card.duration ? (
                  <span className="text-muted-foreground">
                    /{card.duration}
                  </span>
                ) : null}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="text-muted-foreground" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md',
                    {
                      '!bg-muted-foreground': card.title !== 'Unlimited Saas',
                    }
                  )}
                >
                  Get started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
