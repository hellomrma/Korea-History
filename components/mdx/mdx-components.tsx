import Level from './Level'
import DifficultyBadge from '@/components/ui/DifficultyBadge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>

export const MDX_COMPONENTS: MDXComponents = {
  Level,
  DifficultyBadge,
  h1: (props) => <h1 className="font-serif text-3xl font-bold text-text mt-8 mb-4" {...props} />,
  h2: (props) => <h2 className="font-serif text-2xl font-bold text-point mt-6 mb-3" {...props} />,
  h3: (props) => <h3 className="font-serif text-xl font-semibold text-text mt-4 mb-2" {...props} />,
  p:  (props) => <p className="leading-relaxed text-text mb-4" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-4 space-y-1 text-text" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-bold text-text" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-point pl-4 italic text-muted my-4" {...props} />
  ),
}

export function getMDXComponents(): MDXComponents {
  return MDX_COMPONENTS
}
