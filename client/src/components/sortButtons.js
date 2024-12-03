import { useState, useEffect } from "react";

export default function SortButtons({ sortedPosts, currentSortMode }) {
    const [selectedSort, setSelectedSort] = useState("newest");

    useEffect(() => {
        setSelectedSort(currentSortMode); // Sync selectedSort with currentSortMode
    }, [currentSortMode]);

    return (
        <div className="post-order-buttons">
            <input type="button" className={"post-order-button newest" + (selectedSort === "newest" ? " selected" : "")} value="Newest" onClick={() => {
                setSelectedSort("newest");
                sortedPosts("newest"); // Call the function to change sort mode
            }} />
            <input type="button" className={"post-order-button oldest" + (selectedSort === "oldest" ? " selected" : "")} value="Oldest" onClick={() => {
                setSelectedSort("oldest");
                sortedPosts("oldest");
            }} />
            <input type="button" className={"post-order-button active" + (selectedSort === "active" ? " selected" : "")} value="Active" onClick={() => {
                setSelectedSort("active");
                sortedPosts("active");
            }} />
        </div>
    );
}
