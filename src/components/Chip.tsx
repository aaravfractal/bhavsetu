type Props = {
  label: string
  selected?: boolean
  onToggle?: () => void
}

export function Chip({ label, selected = false, onToggle }: Props) {
  return (
    <button type="button" className="chip" aria-pressed={selected} onClick={onToggle}>
      {label}
    </button>
  )
}
