import Styles from './LoadingButton.module.css';

interface LoadingButtonProps {
  isLoading: boolean;
  onClick: (e: any) => void | Promise<void>
  text: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, onClick, text}) => {
  
  const handleClick = async (e:any) => {
    e.preventDefault();
    await onClick(e);
  };

  return (
    <button
      className={`${isLoading ? "bg-violet-700" : "bg-violet-600"} font-semibold bg-violet-600 hover:bg-violet-700 rounded-xl min-w-[82px] flex items-center justify-center w-full text-center text-white h-12 py-2 px-4 focus:outline-none focus:shadow-outline}`}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className={Styles.dotFlashing}>
        </div>
      ) : (
        <p>{text}</p>
      )}
    </button>
  );
};


export default LoadingButton;
