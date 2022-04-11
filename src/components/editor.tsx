export const Editor = ({ tabName }: { tabName?: string }) => {
  return (
    <div className="editor">
      <div className="editor__head">
        <div className="editor__dots">
          <div className="editor__dot editor__dot--red"></div>
          <div className="editor__dot editor__dot--yellow"></div>
          <div className="editor__dot editor__dot--green"></div>
        </div>
        {tabName && <div className="editor__tab">{tabName}</div>}
      </div>
      <div className="editor__body">
        <div className="video">
          <video
            src="/video/test.mp4"
            className="video__content"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
};
