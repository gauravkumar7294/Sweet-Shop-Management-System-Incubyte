const SweetService=require('./SweetService');

test('should add a new sweet to the list',()=>{
    const sweetService=new SweetService();
    const newSeet=sweetService.addSweet({
        name:'Gulab Jamun',
        price:20 
    });
    expect(newSweet.id).toBeDefined();
    expect(newSweet.name).toBe('Gulab Jamun');

    const allSweets=sweetService.getAllSweets();
    expect(allSweets).toHaveLength(1);
    expect(allSweets[0].name).toBe('Gulab Jamun');
  });