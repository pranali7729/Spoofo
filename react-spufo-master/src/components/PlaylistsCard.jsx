import styled from "styled-components";

const PlaylistsCard = (props) => {
  return (
    <CardContainer>
      <PlaylistCardWrapper>
        <div className="playlist-card">
          <PlaylistCardImage>
            <img src={props.image} alt="Featured Playlist" />
          </PlaylistCardImage>
          <PlaylistCardHeader>
            <div className="playlist-card-header-title">{props.name}</div>
          </PlaylistCardHeader>
          <PlaylistCardBody>{props.description}</PlaylistCardBody>
        </div>
      </PlaylistCardWrapper>
    </CardContainer>
  );
};

export default PlaylistsCard;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PlaylistCardWrapper = styled.div`
  flex: 1 0 calc(25% - 20px); /* Adjust as needed */
  margin: 10px;
  border: 1px solid #ccc;
  @media (max-width: 1200px) {
    flex: 1 0 calc(33.33% - 20px); /* Adjust for medium screens */
  }
  @media (max-width: 992px) {
    flex: 1 0 calc(50% - 20px); /* Adjust for small screens */
  }
  @media (max-width: 768px) {
    flex: 1 0 calc(100% - 20px); /* Adjust for extra small screens */
  }
`;

const PlaylistCardImage = styled.div`
  padding: 10px;
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const PlaylistCardHeader = styled.div`
  color: white;
  padding: 10px;
`;

const PlaylistCardBody = styled.div`
  color: white;
  padding: 10px;
`;
