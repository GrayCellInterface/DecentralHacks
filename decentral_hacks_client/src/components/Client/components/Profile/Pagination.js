import React from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<nav>
			<ul className="pagination text-center">
				{pageNumbers.map((number) => (
					<li key={number} className="page-item">
						<a href='#page' onClick={() => paginate(number)} className="page-link">
							{number}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Pagination;
