interface BlockProps {
    children: any
    className: string
    id: string
}

export default function Block({children, className, id}: BlockProps) {
    return (
        <div id={id} className={className + " border-black border rounded-2xl left-0 overflow-scroll"}>
            {children}
        </div>
    )
}