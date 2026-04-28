import Level from './Level'
import DifficultyBadge from '@/components/ui/DifficultyBadge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>

export const MDX_COMPONENTS: MDXComponents = {
  Level,
  DifficultyBadge,
  h1: (props) => <h1 className="text-3xl font-semibold text-text tracking-tight mt-12 mb-5" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold text-text tracking-tight mt-10 mb-4" {...props} />,
  h3: (props) => <h3 className="text-xl font-semibold text-text tracking-tight mt-6 mb-3" {...props} />,
  p:  (props) => <p className="leading-[1.85] text-text mb-5" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-5 space-y-1.5 text-text" {...props} />,
  li: (props) => <li className="leading-[1.85]" {...props} />,
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-text pl-5 my-6 text-muted" {...props} />
  ),
}

export function getMDXComponents(): MDXComponents {
  return MDX_COMPONENTS
}
