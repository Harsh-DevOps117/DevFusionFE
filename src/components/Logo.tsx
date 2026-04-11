const Logo = () => {
  return (
    <a href="#" className="flex items-center gap-3">
      <img
        src="https://sheryians.com/assets/images/logo.png"
        alt="Sheryians Logo"
        className="w-10 h-10 object-contain"
      />
      <div className="text-sm font-medium leading-tight">
        Sheryians
        <span className="block text-xs text-[#8a8278]">Coding School</span>
      </div>
    </a>
  );
};

export default Logo;
