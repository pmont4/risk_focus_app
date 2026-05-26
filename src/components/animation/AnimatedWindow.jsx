import { AnimatePresence, motion } from "framer-motion"

export const AnimatedWindow = ({ condition = false, children, childrenIfFalse }) => {
    return (
        <>
            <AnimatePresence initial={false} mode="wait">
                {!condition ? (
                    <motion.div
                        key="input"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ overflow: "hidden" }}
                    >
                        {childrenIfFalse}
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ overflow: "hidden" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}