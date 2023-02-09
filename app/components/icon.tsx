import type {SVGAttributes} from 'react'

const icons = [
  'skip_previous',
  'pause',
  'play_arrow',
  'skip_next',
  'volume_off',
  'volume_up',
] as const

export type IconNames = typeof icons[number]

type IconProps = SVGAttributes<SVGElement> & {
  id: IconNames
}

export const Icon = ({id, width = 24, height = 24, ...props}: IconProps) => {
  return (
    <svg data-testid={`icon-${id}`} width={width} height={height} {...props}>
      <use href={`/assets/sprite.svg#${id}`} />
    </svg>
  )
}
