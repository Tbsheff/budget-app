const TrustedBy = () => {
  const companies = [
    { name: "Forbes", className: "w-24" },
    { name: "TechCrunch", className: "w-28" },
    { name: "Business Insider", className: "w-28" },
    { name: "Bloomberg", className: "w-24" }
  ];

  return (
    <section className="py-24 bg-neutral-200/50">
      <div className="container-padding">
        <p className="text-center text-neutral-600 mb-12">Featured in leading financial publications</p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {companies.map((company) => (
            <div key={company.name} className={`${company.className} h-8 bg-neutral-400/20 rounded-lg`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;