const Sidebar = () => {
  return (
    <>
      {/* // Mobile Version */}
      <div
        className={`lg:hidden fixed left-0 top-[8vh] w-[80%] bg-[#0F172A] h-[92vh] transition-transform duration-300
        }`}
      >
        <p>ddjkdv</p>
      </div>


      {/* //Desktop Version */}
      <div className="hidden lg:flex w-[25%] h-[90vh] bg-[#0F172A] fixed  top-[10vh]">

      </div>
    </>
  );
};

export default Sidebar;
