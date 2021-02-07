import React from 'react';
import { Link } from 'react-router-dom';

export default ({ data }) => {
  return (
    <div className="CommentAuthor">
      <Link to={`/user/${data.username}`}>
        {data.firstname} {data.lastname}
      </Link>
    </div>
  );
};