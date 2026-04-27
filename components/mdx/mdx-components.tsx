import Level from './Level'
import DifficultyBadge from '@/components/ui/DifficultyBadge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>

export const MDX_COMPONENTS: MDXComponents = {
  Level,
  DifficultyBadge,
  h1: (props) => <h1 className="font-serif text-3xl font-bold text-traditional-dark mt-8 mb-4" {...props} />,
  h2: (props) => <h2 className="font-serif text-2xl font-bold text-traditional mt-6 mb-3" {...props} />,
  h3: (props) => <h3 className="font-serif text-xl font-semibold text-traditional-dark mt-4 mb-2" {...props} />,
  p:  (props) => <p className="leading-relaxed text-gray-800 mb-4" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-800" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-bold text-traditional-dark" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-traditional pl-4 italic text-gray-600 my-4" {...props} />
  ),
}

export function getMDXComponents(): MDXComponents {
  return MDX_COMPONENTS
}
