<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_employee = new Role();
        $role_employee->name = 'super_admin';
        $role_employee->description = 'A Super User';
        $role_employee->save();

        $role_manager = new Role();
        $role_manager->name = 'country_admin';
        $role_manager->description = 'A country admin';
        $role_manager->save();

        $role_manager = new Role();
        $role_manager->name = 'user';
        $role_manager->description = 'Basic user';
        $role_manager->save();
    }
}
