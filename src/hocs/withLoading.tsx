import { Loading } from '@app/components/Loading'
import React, { Suspense } from 'react'

type ReturnType<T> = (props: T) => JSX.Element

// eslint-disable-next-line @typescript-eslint/ban-types
export const withLoading = <T extends object>(
  Component: React.ComponentType<T>
): ReturnType<T> => {
  return (props: T) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  )
}
